package edu.uok.stu.service.impl;

import edu.uok.stu.model.dto.MsgDto;
import edu.uok.stu.model.entity.MsgEntity;
import edu.uok.stu.repository.MsgRepository;
import edu.uok.stu.service.MsgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class MsgServiceImpl implements MsgService {

    @Autowired
    private MsgRepository msgRepository;


    @Override
    public Object saveMessage(MsgDto msgDto) {

        var msg = MsgEntity.builder()
                .name(msgDto.getName())
                .email(msgDto.getEmail())
                .message(msgDto.getMessages())
                .build();

        msgRepository.save(msg);

        return true;
    }

    @Override
    public List<MsgDto> getMessages() {
        List<MsgEntity> messages = msgRepository.findAll();
        List<MsgDto> msgDtos = new ArrayList<>();

        for(MsgEntity msg : messages){
           MsgDto msgDto = new MsgDto(
                   msg.getName(),
                   msg.getEmail(),
                   msg.getMessage()
           );
           msgDtos.add(msgDto);
        }
        return msgDtos;
    }

}
