package com.dev_robert.hiremzanzi.repos;

import com.dev_robert.hiremzanzi.models.PageHit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageHitRepo extends MongoRepository<PageHit, String> {

}
