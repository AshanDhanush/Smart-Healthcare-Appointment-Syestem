package edu.uok.stu.repository;

import edu.uok.stu.model.entity.MsgEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MsgRepository extends MongoRepository<MsgEntity,String> {

}
