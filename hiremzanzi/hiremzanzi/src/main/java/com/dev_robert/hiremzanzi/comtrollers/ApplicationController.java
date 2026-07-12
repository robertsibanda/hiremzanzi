package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.models.Application;
import com.dev_robert.hiremzanzi.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String coverLetter,
            @RequestParam String vacancyId,
            @RequestParam String vacancyTitle,
            @RequestParam String companyName,
            @RequestParam(required = false) MultipartFile cv) throws IOException {

        Application app = new Application();
        app.setFullName(fullName);
        app.setEmail(email);
        app.setPhone(phone);
        app.setCoverLetter(coverLetter);
        app.setVacancyId(vacancyId);
        app.setVacancyTitle(vacancyTitle);
        app.setCompanyName(companyName);

        if (cv != null && !cv.isEmpty()) {
            app.setCvFileName(cv.getOriginalFilename());
            app.setCvData(cv.getBytes());
        }

        Application saved = applicationService.create(app);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "message", "Application submitted successfully"
        ));
    }

    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<?> getByVacancy(@PathVariable String vacancyId) {
        long count = applicationService.countByVacancyId(vacancyId);
        return ResponseEntity.ok(Map.of(
                "vacancyId", vacancyId,
                "applicationCount", count
        ));
    }
}
