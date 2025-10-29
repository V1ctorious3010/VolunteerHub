package com.example.backend.security;

import com.example.backend.entity.Volunteer;
import com.example.backend.repo.VolunteerRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.stream.Stream;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

        // 1. Đọc token từ cookie
        String token = getTokenFromCookie(request);

        if (token != null) {
            System.out.println("DEBUG JWT: Token found in Cookie: " + token.substring(0, 10)
                + "..."); // ⭐️ Log tìm thấy token
            try {
                // 2. Xác thực và trích xuất email
                String userEmail = jwtService.extractUsername(token);
                System.out.println(
                    "DEBUG JWT: Extracted Email: " + userEmail); // ⭐️ Log email trích xuất
                // 3. Nếu token hợp lệ và chưa được xác thực
                if (userEmail != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Do ứng dụng chỉ sử dụng email làm định danh, chúng ta tạo UserDetails giả
                    // Trong ứng dụng thực tế, bạn sẽ load UserDetails từ Database
//          UserDetails userDetails = new User(userEmail, "", Collections.emptyList());

                    Volunteer volunteerDetails = volunteerRepository.findByEmail(userEmail)
                        .orElseThrow();
                    if (volunteerDetails != null) {
                        System.out.println("DEBUG JWT: Volunteer Entity loaded successfully: "
                            + volunteerDetails.getEmail()); // ⭐️ Log thành công

                        // 4. Tạo đối tượng Authentication
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            volunteerDetails, // ⭐️ Đặt Entity Volunteer thực tế vào Context
                            null,
                            volunteerDetails.getAuthorities()); // Yêu cầu Volunteer implement UserDetails

                        authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                        // 5. Thiết lập SecurityContext (Xác thực người dùng)
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                    } else {
                        System.err.println(
                            "DEBUG JWT ERROR: Volunteer found in token but not in database: "
                                + userEmail);
                    }
                }
            } catch (Exception e) {
                // Xóa token lỗi và cho phép request đi tiếp, sẽ bị chặn bởi AuthorizationFilter sau
                System.err.println("JWT validation failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    // Phương thức helper để lấy token từ cookie
    private String getTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        // Tìm kiếm cookie có tên là "token"
        return Stream.of(request.getCookies())
            .filter(cookie -> "token".equals(cookie.getName()))
            .findFirst()
            .map(Cookie::getValue)
            .orElse(null);
    }
}