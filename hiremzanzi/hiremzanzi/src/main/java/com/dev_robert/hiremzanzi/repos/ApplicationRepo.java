package com.dev_robert.hiremzanzi.repos;

import com.dev_robert.hiremzanzi.models.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepo extends MongoRepository<Application, String> {

    List<Application> findByVacancyId(String vacancyId);

    List<Application> findByEmail(String email);

    long countByVacancyId(String vacancyId);
}
