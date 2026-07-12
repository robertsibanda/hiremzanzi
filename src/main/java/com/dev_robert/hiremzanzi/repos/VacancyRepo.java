package com.dev_robert.hiremzanzi.repos;

import com.dev_robert.hiremzanzi.models.Vacancy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacancyRepo extends MongoRepository<Vacancy, String> {

    List<Vacancy> findByTitle(String title);

    Optional<Vacancy> getVacancyById (String id);

    List<Vacancy> findByCategory(String category);

    List<Vacancy> findByTitleContainingIgnoreCase(String title);
}
