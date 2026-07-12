package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.models.Vacancy;
import com.dev_robert.hiremzanzi.repos.VacancyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VacancyService {

    @Autowired
    VacancyRepo vacancyRepo;

    public Vacancy create(Vacancy vacancy) {
        vacancy.setCreatedDate(LocalDateTime.now());
        return vacancyRepo.save(vacancy);
    }

    public List<Vacancy> getVacancies () {
        return vacancyRepo.findAll();
    }

    public Page<Vacancy> getAllPaged(Pageable pageable) {
        return vacancyRepo.findAll(pageable);
    }

    public Page<Vacancy> getCategoryPaged(String category, Pageable pageable) {
        return vacancyRepo.findByCategory(category, pageable);
    }

    public Page<Vacancy> searchPaged(String title, Pageable pageable) {
        return vacancyRepo.findByTitleContainingIgnoreCase(title, pageable);
    }

    public List<Vacancy> getVacanciesByCategory(String category) {
        return vacancyRepo.findByCategory(category);
    }

    public List<Vacancy> getVacanciesByName(String title) {
        return vacancyRepo.findByTitleContainingIgnoreCase(title);
    }

    public Vacancy getVacanciesById (String id) {
        return vacancyRepo.getVacancyById(id).orElse(null);
    }


}
