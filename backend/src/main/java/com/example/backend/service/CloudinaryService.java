package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.exception.BadCredentialsAppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map<String, Object> getSignature() {
        try {
            long timestamp = System.currentTimeMillis() / 1000;
            String folder = "my_app_avatars";

            Map<String, Object> params = ObjectUtils.asMap(
                "folder", folder,
                "timestamp", timestamp
            );

            String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

            return ObjectUtils.asMap(
                "signature", signature,
                "timestamp", timestamp,
                "api_key", cloudinary.config.apiKey,
                "cloud_name", cloudinary.config.cloudName,
                "folder", folder
            );
        } catch (Exception e) {
            throw new BadCredentialsAppException("Lỗi tạo chữ ký");
        }
    }
}