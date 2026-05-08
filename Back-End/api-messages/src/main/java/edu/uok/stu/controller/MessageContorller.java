package edu.uok.stu.controller;

import edu.uok.stu.model.dto.MsgDto;
import edu.uok.stu.service.MsgService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")

@RequiredArgsConstructor

public class MessageContorller {
    @Autowired
    private final MsgService msgService;

    @PostMapping("/save")
    public ResponseEntity<?> saveMessage(@RequestBody MsgDto msgDto){
       return ResponseEntity.ok(msgService.saveMessage(msgDto));
    }

    @GetMapping("/get")
    public List<MsgDto> getMessages(){
        return msgService.getMessages();
    }
}
