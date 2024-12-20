package com.project.project_rest_api;

import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.service.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceImplTest {
        @Mock
        private StudentRepository studentRepository;

        @InjectMocks
        private StudentServiceImpl studentService;

        private Student student;

        @BeforeEach
        void setUp() {
            MockitoAnnotations.openMocks(this);
            student = new Student("Jan", "Kowalski", "12345", "jan.kowalski@example.com", true);
        }

        @Test
        void testGetStudent() {
            // Given
            int studentId = 1;
            student.setStudentId(studentId);
            when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));

            // When
            Optional<Student> result = studentService.getStudent(studentId);

            // Then
            assertTrue(result.isPresent());
            assertEquals(studentId, result.get().getStudentId());
            assertEquals("Jan", result.get().getImie());
            assertEquals("Kowalski", result.get().getNazwisko());
            assertEquals("12345", result.get().getNrIndeksu());
            assertEquals("jan.kowalski@example.com", result.get().getEmail());
            assertTrue(result.get().isStacjonarny());
            verify(studentRepository, times(1)).findById(studentId);
        }

        @Test
        void testSetStudent() {
            // Given
            student.setStudentId(null); // Assuming new student (no ID yet)
            Student savedStudent = new Student("Jan", "Kowalski", "12345", "jan.kowalski@example.com", true);
            savedStudent.setStudentId(1); // Simulating saved student with an ID
            when(studentRepository.save(student)).thenReturn(savedStudent);

            // When
            Student result = studentService.setStudent(student);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getStudentId());
            assertEquals("Jan", result.getImie());
            assertEquals("Kowalski", result.getNazwisko());
            assertEquals("12345", result.getNrIndeksu());
            assertEquals("jan.kowalski@example.com", result.getEmail());
            assertTrue(result.isStacjonarny());
            verify(studentRepository, times(1)).save(student);
        }

        @Test
        void testDeleteStudent() {
            // Given
            int studentId = 1;
            doNothing().when(studentRepository).deleteById(studentId);

            // When
            studentService.deleteStudent(studentId);

            // Then
            verify(studentRepository, times(1)).deleteById(studentId);
        }

        @Test
        void testGetStudents() {
            // Given
            Pageable pageable = Pageable.ofSize(10);
            List<Student> students = List.of(
                    new Student("Jan", "Kowalski", "12345", "jan.kowalski@example.com", true),
                    new Student("Anna", "Nowak", "67890", "anna.nowak@example.com", false)
            );
            Page<Student> page = new PageImpl<>(students);
            when(studentRepository.findAll(pageable)).thenReturn(page);

            // When
            Page<Student> result = studentService.getStudents(pageable);

            // Then
            assertNotNull(result);
            assertEquals(2, result.getTotalElements());
            assertEquals("Jan", result.getContent().get(0).getImie());
            assertEquals("Anna", result.getContent().get(1).getImie());
            verify(studentRepository, times(1)).findAll(pageable);
        }

        @Test
        void testSearchByNazwisko() {
            // Given
            String nazwisko = "Ko";
            Pageable pageable = Pageable.ofSize(10);
            List<Student> students = List.of(
                    new Student("Jan", "Kowalski", "12345", "jan.kowalski@example.com", true)
            );
            Page<Student> page = new PageImpl<>(students);
            when(studentRepository.findByNazwiskoStartsWithIgnoreCase(nazwisko, pageable)).thenReturn(page);

            // When
            Page<Student> result = studentService.searchByNazwisko(nazwisko, pageable);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals("Kowalski", result.getContent().get(0).getNazwisko());
            verify(studentRepository, times(1)).findByNazwiskoStartsWithIgnoreCase(nazwisko, pageable);
        }
}
