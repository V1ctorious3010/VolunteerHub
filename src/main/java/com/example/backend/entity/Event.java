package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event") // Tên bảng trong MySQL là event
@Data // Tự động tạo getters, setters, toString, equals, hashCode (Lombok)
public class Event {

    public enum EventStatus {
        COMING,
        ONGOING,
        FINISHED,
        CANCELLED
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id; // Tương đương id

    //  @JsonProperty("postTitle")
    @Column(name = "title")
    private String title;

    @Column(name = "location")
    private String location;

    @Column(name = "thumbnail")
    private String thumbnail; // url trên local

    @Column(name = "noOfVolunteer")
    private Integer noOfVolunteer; // Số lượng tình nguyện viên cần

    @Column(name = "remaining")
    private Integer remaining; // Số lượng còn lại

    @Column(name = "startTime")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startTime; // Sử dụng LocalDateTime cho deadline

    @Column(name = "duration")
    private String duration; // Thời gian dự kiến (format: " 2h30' " hoặc " 50' ")

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @ManyToOne
    @JoinColumn(name = "managerId")
    private User manager;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Registration> requests;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventCategory> categories;

}
