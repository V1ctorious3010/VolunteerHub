package com.example.backend.security;

import com.example.backend.entity.User;
import com.example.backend.repo.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final UserRepository userRepository;
    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final Duration accessTtl;
    private final Duration refreshTtl;

    /**
     * @param accessSecret base64-encoded or plain string
     * @param refreshSecret base64-encoded or plain string
     */
    public JwtService(
        UserRepository userRepository,
        @Value("${security.jwt.access.secret}") String accessSecret,
        @Value("${security.jwt.refresh.secret}") String refreshSecret,
        @Value("${security.jwt.access.expiration}") long accessMinutes,
        @Value("${security.jwt.refresh.expiration}") long refreshDays
    ) {
        this.userRepository = userRepository;
        this.accessKey = decodeKey(accessSecret);
        this.refreshKey = decodeKey(refreshSecret);
        this.accessTtl = Duration.ofMinutes(accessMinutes);
        this.refreshTtl = Duration.ofDays(refreshDays);
    }

    /**
     * Generate access token for Volunteer
     * @param v the Volunteer
     * @return the JWT access token
     */
    public String generateAccessToken(User v) {
        return buildToken(
            Map.of(
                "role", v.getRole().name(),
                "name", v.getName(),
                "type", "access"
            ),
            v.getEmail(),
            accessTtl,
            accessKey
        );
    }

    /**
     * Generate refresh token for Volunteer
     * @param v the Volunteer
     * @return the JWT refresh token
     */
    public String generateRefreshToken(User v) {
        return buildToken(
            Map.of("type", "refresh"),
            v.getEmail(),
            refreshTtl,
            refreshKey
        );
    }

    /**
     * Validate access token
     */
    public boolean isAccessTokenValid(String token) {
        try {
            Claims c = parse(token, accessKey);
            return "access".equals(c.get("type")) && !isExpired(c);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract email from access token
     * @param token the JWT access token
     * @return the email
     */
    public String extractEmailFromAccess(String token) {
        Claims c = parse(token, accessKey);
        if (!"access".equals(c.get("type"))) {
            throw new JwtException("Invalid token type");
        }
        return c.getSubject();
    }

    /**
     * Validate refresh token and load the associated Volunteer
     * @param refreshToken the JWT refresh token
     * @return the Volunteer if valid; null otherwise
     */
    public User validateRefreshAndLoadUser(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return null;
        }
        try {
            Claims c = parse(refreshToken, refreshKey);
            if (!"refresh".equals(c.get("type"))) {
                return null;
            }
            if (isExpired(c)) {
                return null;
            }
            String email = c.getSubject();
            return userRepository.findByEmail(email).orElse(null);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Build a JWT token
     */
    private String buildToken(
        Map<String, Object> claims,
        String subject,
        Duration ttl,
        SecretKey key
    ) {
        Instant now = Instant.now();
        Instant exp = now.plus(ttl);
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(exp))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * Parse JWT token and return claims
     */
    private Claims parse(String token, SecretKey key) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * Check if the token is expired
     */
    private boolean isExpired(Claims claims) {
        Date exp = claims.getExpiration();
        return exp == null || exp.before(new Date());
    }

    /**
     * Decode secret key from base64 or plain string
     */
    private SecretKey decodeKey(String maybeBase64) {
        try {
            byte[] decoded = Decoders.BASE64.decode(maybeBase64);
            return Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException e) {
            return Keys.hmacShaKeyFor(maybeBase64.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * Extract role from access token
     */
    public String extractRole(String token) {
        return parse(token, accessKey).get("role", String.class);
    }
}
