package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.models.Vacancy;
import com.dev_robert.hiremzanzi.services.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/paged")
    public Map<String, Object> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String title) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Vacancy> result;

        if (title != null && !title.isEmpty()) {
            result = vacancyService.searchPaged(title, pageable);
        } else if (category != null && !category.isEmpty()) {
            result = vacancyService.getCategoryPaged(category, pageable);
        } else {
            result = vacancyService.getAllPaged(pageable);
        }

        return Map.of(
            "content", result.getContent(),
            "totalElements", result.getTotalElements(),
            "totalPages", result.getTotalPages(),
            "currentPage", result.getNumber(),
            "size", result.getSize()
        );
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
