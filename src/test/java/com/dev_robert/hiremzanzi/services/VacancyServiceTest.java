package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.repos.VacancyRepo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Vacancy Service Unit Test")
class VacancyServiceTest {

    @InjectMocks
    private VacancyService vacancyService;

    @Mock
    private VacancyRepo vacancyRepo;

    @Nested
    @DisplayName("Create Vacancy Tests")
    class CreateVacancyTests {

        @Test
        @DisplayName("Should create Vacancy successfully")
        void shouldCreateVacancySuccessfully() {

        }

    }


}