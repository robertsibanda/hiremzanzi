package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.models.Application;
import com.dev_robert.hiremzanzi.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private static final String UPLOAD_DIR = "/root/hiremzanzi/uploads/";

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
            @RequestParam(required = false) String companyEmail,
            @RequestParam(required = false) MultipartFile cv) throws IOException {

        Application app = new Application();
        app.setFullName(fullName);
        app.setEmail(email);
        app.setPhone(phone);
        app.setCoverLetter(coverLetter);
        app.setVacancyId(vacancyId);
        app.setVacancyTitle(vacancyTitle);
        app.setCompanyName(companyName);
        app.setCompanyEmail(companyEmail);

        if (cv != null && !cv.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath);

            String originalFilename = cv.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + ext;

            Path filePath = uploadPath.resolve(filename);
            cv.transferTo(filePath.toFile());

            app.setCvFileName(originalFilename);
            app.setCvPath(filename);
        }

        Application saved = applicationService.create(app);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "message", "Application submitted successfully"
        ));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return applicationService.getById(id)
                .map(app -> ResponseEntity.ok((Object) app))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<?> downloadCv(@PathVariable String id) {
        var opt = applicationService.getById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Application app = opt.get();
        if (app.getCvPath() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "No CV attached"));
        }
        File file = new File(UPLOAD_DIR + app.getCvPath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + app.getCvFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<?> getByVacancy(@PathVariable String vacancyId) {
        long count = applicationService.countByVacancyId(vacancyId);
        return ResponseEntity.ok(Map.of(
                "vacancyId", vacancyId,
                "applicationCount", count
        ));
    }

    @PutMapping("/{id}/company-email")
    public ResponseEntity<?> updateCompanyEmail(@PathVariable String id, @RequestBody Map<String, String> body) {
        String companyEmail = body.get("companyEmail");
        Application updated = applicationService.updateCompanyEmail(id, companyEmail);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Company email updated", "companyEmail", companyEmail));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        applicationService.getById(id).ifPresent(app -> {
            if (app.getCvPath() != null) {
                File file = new File(UPLOAD_DIR + app.getCvPath());
                if (file.exists()) {
                    file.delete();
                }
            }
        });
        applicationService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted"));
    }
}
