package org.example.utcctp.repository;

import org.example.utcctp.model.FileAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FileAssetRepository extends JpaRepository<FileAsset, UUID> {
    List<FileAsset> findByUploadedByIdOrderByUploadedAtDesc(UUID userId);
    List<FileAsset> findByUploadedByIdAndCategoryOrderByUploadedAtDesc(UUID userId, String category);
}
