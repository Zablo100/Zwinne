package com.project.project_rest_api.datasource;

import com.project.project_rest_api.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByNrIndeksu(String nrIndeksu);
    Page<Student> findByNrIndeksuStartsWith(String nrIndeksu, Pageable pageable);
    Page<Student> findByNazwiskoStartsWithIgnoreCase(String nazwisko, Pageable pageable);
    Student findByEmail(String email);



    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
            "FROM projekt_student ps " +
            "WHERE ps.projekt_id = :projektId AND ps.student_id = :studentId",
            nativeQuery = true)
    boolean existsByProjektIdAndStudentId(@Param("projektId") Integer projektId, @Param("studentId") Integer studentId);


}
