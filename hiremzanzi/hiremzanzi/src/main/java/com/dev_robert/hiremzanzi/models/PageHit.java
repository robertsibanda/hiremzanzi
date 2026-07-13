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
public class PageHit {

    @Id
    private String id;

    private String path;

    private String ipAddress;

    private String city;

    private String region;

    private String country;

    private String userAgent;

    private LocalDateTime timestamp;

}
