package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.models.Application;
import com.dev_robert.hiremzanzi.repos.ApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    ApplicationRepo applicationRepo;

    public Application create(Application application) {
        application.setCreatedDate(LocalDateTime.now());
        return applicationRepo.save(application);
    }

    public List<Application> getByVacancyId(String vacancyId) {
        return applicationRepo.findByVacancyId(vacancyId);
    }

    public List<Application> getByEmail(String email) {
        return applicationRepo.findByEmail(email);
    }

    public long countByVacancyId(String vacancyId) {
        return applicationRepo.countByVacancyId(vacancyId);
    }
}
