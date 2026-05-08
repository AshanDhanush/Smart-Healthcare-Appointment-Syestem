package edu.uok.stu.service;

import edu.uok.stu.model.dto.MsgDto;

import java.util.List;

public interface MsgService {
    Object saveMessage(MsgDto msgDto);

     List<MsgDto> getMessages();
}
