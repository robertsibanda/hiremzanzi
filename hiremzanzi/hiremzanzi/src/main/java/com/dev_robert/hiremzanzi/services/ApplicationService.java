package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.models.Application;
import com.dev_robert.hiremzanzi.repos.ApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    ApplicationRepo applicationRepo;

    public Application create(Application application) {
        application.setCreatedDate(LocalDateTime.now());
        return applicationRepo.save(application);
    }

    public Optional<Application> getById(String id) {
        return applicationRepo.findById(id);
    }

    public List<Application> getAll() {
        return applicationRepo.findAll();
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

    public void deleteById(String id) {
        applicationRepo.deleteById(id);
    }

    public void verify(String id) {
        var opt = applicationRepo.findById(id);
        if (opt.isPresent()) {
            Application app = opt.get();
            app.setVerified(true);
            applicationRepo.save(app);
        }
    }

    public Application updateCompanyEmail(String id, String companyEmail) {
        Optional<Application> opt = applicationRepo.findById(id);
        if (opt.isPresent()) {
            Application app = opt.get();
            app.setCompanyEmail(companyEmail);
            return applicationRepo.save(app);
        }
        return null;
    }
}
