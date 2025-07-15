package com.back.global.file.file;

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

    private String type;
    private String name;

    public File(String type, String name) {
        this.type = type;
        this.name = name;
    }


}
