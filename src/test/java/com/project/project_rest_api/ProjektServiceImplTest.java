package com.project.project_rest_api;

import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.service.ProjektServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class ProjektServiceImplTest {

    @Mock
    private ProjektRepository projektRepository;

    @InjectMocks
    private ProjektServiceImpl projektService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testGetProjekt() {
        //Given
        Pageable pageable = (Pageable) PageRequest.of(0, 10);
        Projekt projekt = new Projekt();
        projekt.setProjektId(1);
        projekt.setNazwa("Test Projekt");
        PageImpl<Projekt> expectedPage = new PageImpl<>(Collections.singletonList(projekt));
        when(projektRepository.findAll((PageRequest) pageable)).thenReturn(expectedPage);
        //When
        Page<Projekt> resultPage = projektService.getProjekty((org.springframework.data.domain.Pageable) pageable);
        //Then
        assertEquals(expectedPage, resultPage);
        assertEquals(1, resultPage.getContent().size());
        assertEquals("Test Projekt", resultPage.getContent().getFirst().getNazwa());
        verify(projektRepository, times(1)).findAll((PageRequest) pageable);
    }
}
