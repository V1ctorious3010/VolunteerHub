package com.example.backend.repo;


import com.example.backend.entity.VolunteerPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VolunteerPostRepository extends JpaRepository<VolunteerPost, Long> {

    // Lấy 6 bài sắp hết hạn (deadline ASC)
    List<VolunteerPost> findTop6ByOrderByDeadlineAsc();

    // Tìm kiếm bằng postTitle (LIKE)
    List<VolunteerPost> findByPostTitleContainingIgnoreCase(String postTitle);

    // Lấy bài đăng theo email của tổ chức (API bị comment)
    List<VolunteerPost> findByOrgEmail(String orgEmail);

    VolunteerPost findById(long id);

    // API: update-volunteer-count/:id
    @Modifying
    @Query("UPDATE VolunteerPost vp SET vp.noOfVolunteer = vp.noOfVolunteer - 1 WHERE vp.id = :id AND vp.noOfVolunteer > 0")
    int decrementVolunteerCount(@Param("id") Long id);
}