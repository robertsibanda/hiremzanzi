package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.services.PageHitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hits")
@CrossOrigin(origins = "*")
public class PageHitController {

    @Autowired
    PageHitService pageHitService;

    @GetMapping
    public ResponseEntity<?> getAllHits() {
        return ResponseEntity.ok(pageHitService.getAllHits());
    }
}
