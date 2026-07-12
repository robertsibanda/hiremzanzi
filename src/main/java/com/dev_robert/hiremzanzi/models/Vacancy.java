package com.dev_robert.hiremzanzi.models;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
public class Vacancy {

    @Id
    private String id;

    @NonNull
    private String companyName;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @NonNull
    private String location;

    private LocalDateTime createdDate;

    private LocalDateTime expiryDate;

    private String salary;

    private String category;

}
