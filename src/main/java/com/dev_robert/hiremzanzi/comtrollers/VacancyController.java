package com.dev_robert.hiremzanzi.comtrollers;


import com.dev_robert.hiremzanzi.models.Vacancy;
import com.dev_robert.hiremzanzi.services.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VacancyController {

    @Autowired
    VacancyService vacancyService;
}
