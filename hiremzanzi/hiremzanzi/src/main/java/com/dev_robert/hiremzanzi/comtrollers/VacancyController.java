package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.models.Vacancy;
import com.dev_robert.hiremzanzi.services.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vacancies")
@CrossOrigin(origins = "*")
public class VacancyController {

    @Autowired
    VacancyService vacancyService;

    @GetMapping
    public List<Vacancy> getAll() {
        return vacancyService.getVacancies();
    }

    @GetMapping("/{id}")
    public Vacancy getById(@PathVariable String id) {
        return vacancyService.getVacanciesById(id);
    }

    @GetMapping("/category/{category}")
    public List<Vacancy> getByCategory(@PathVariable String category) {
        return vacancyService.getVacanciesByCategory(category);
    }

    @GetMapping("/search")
    public List<Vacancy> search(@RequestParam String title) {
        return vacancyService.getVacanciesByName(title);
    }
}
