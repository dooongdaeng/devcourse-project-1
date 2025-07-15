package com.back.global.file.file.service;

import com.back.global.file.file.entity.File;
import com.back.global.file.file.respository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {
    private final FileRepository fileRepository;

    public File createFile(String fileName, String filetype) {
        File file = new File(fileName, filetype);
        return fileRepository.save(file);
    }

    public File getFileById(int fileId){
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
    }

    public List<File> getFileByType(String type) {
        return fileRepository.findByType(type);
    }

    public File getFileByName(String name) {
        return fileRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("File not found with name: " + name));
    }

    public void deleteFile(int id) {
        File file = getFileById(id);
        fileRepository.delete(file);
    }

    public boolean fileExists(int fileId) {
        return fileRepository.existsById(fileId);
    }
}
