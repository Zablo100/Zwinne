package com.project.project_rest_api.datasource;

import com.project.project_rest_api.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT cm FROM ChatMessage cm JOIN FETCH cm.student WHERE cm.projekt.projektId = :projektId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findChatHistoryByProjektId(@Param("projektId") Integer projektId);


}
