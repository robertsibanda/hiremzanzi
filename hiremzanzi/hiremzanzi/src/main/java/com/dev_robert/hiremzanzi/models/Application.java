package com.dev_robert.hiremzanzi.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Application {

    @Id
    private String id;

    private String fullName;

    private String email;

    private String phone;

    private String coverLetter;

    private String vacancyId;

    private String vacancyTitle;

    private String companyName;

    private String companyEmail;

    private String cvFileName;

    private String cvPath;

    private boolean verified;

    private String verificationToken;

    private LocalDateTime createdDate;

}
