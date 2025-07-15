package com.back.global.file.file.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file")
@Getter
@NoArgsConstructor
public class File extends BaseEntity {

    private String name;
    private String type;

    public File(String name, String type) {
        this.name = name;
        this.type = type;
    }
}
