package com.back.global.file.file.respository;

import com.back.global.file.file.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Integer> {
    List<File> findByType(String type);

    Optional<File> findByName(String name);
}
