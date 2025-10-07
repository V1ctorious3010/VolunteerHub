package org.example.auth.dto;
import lombok.*;
// an thong tin
@Getter @Setter @AllArgsConstructor
public class UserView {
    private Long id;
    private String name;
    private String email;
    private String role;
}