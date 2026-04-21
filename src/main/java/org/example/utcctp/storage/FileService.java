package org.example.utcctp.storage;

import org.example.utcctp.model.FileAsset;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.FileAssetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class FileService {
    private final FileAssetRepository fileAssetRepository;
    private final LocalStorageProvider localProvider;
    private final CloudinaryStorageProvider cloudinaryProvider;
    private final String preferredProvider;

    public FileService(
            FileAssetRepository fileAssetRepository,
            LocalStorageProvider localProvider,
            CloudinaryStorageProvider cloudinaryProvider,
            @Value("${app.storage.provider:auto}") String preferredProvider
    ) {
        this.fileAssetRepository = fileAssetRepository;
        this.localProvider = localProvider;
        this.cloudinaryProvider = cloudinaryProvider;
        this.preferredProvider = preferredProvider;
    }

    private StorageProvider selectProvider() {
        String p = preferredProvider == null ? "auto" : preferredProvider.toLowerCase();
        if (p.equals("cloudinary")) {
            return cloudinaryProvider;
        }
        if (p.equals("local")) {
            return localProvider;
        }
        // auto: use cloudinary when configured, otherwise local.
        return cloudinaryProvider.isConfigured() ? cloudinaryProvider : localProvider;
    }

    public FileAsset store(MultipartFile file, User user, String category, String docType) {
        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "-" + originalName;

        StorageProvider provider = selectProvider();
        StoredObject stored = provider.store(file, storedName);

        FileAsset asset = new FileAsset();
        asset.setOriginalName(originalName);
        asset.setStoredName(storedName);
        asset.setContentType(file.getContentType());
        asset.setSizeBytes(file.getSize());
        asset.setStoragePath(stored.storagePath());
        asset.setProvider(stored.provider());
        asset.setPublicUrl(stored.publicUrl());
        asset.setExternalId(stored.externalId());
        asset.setCategory(category);
        asset.setDocType(docType);
        asset.setUploadedBy(user);
        return fileAssetRepository.save(asset);
    }

    public java.util.List<FileAsset> listUserFiles(UUID userId, String category) {
        if (category != null) {
            return fileAssetRepository.findByUploadedByIdAndCategoryOrderByUploadedAtDesc(userId, category);
        }
        return fileAssetRepository.findByUploadedByIdOrderByUploadedAtDesc(userId);
    }

    public FileAsset getAsset(UUID id) {
        return fileAssetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
    }

    public Resource load(UUID id) {
        FileAsset asset = getAsset(id);
        StorageProvider provider = "CLOUDINARY".equalsIgnoreCase(asset.getProvider())
                ? cloudinaryProvider : localProvider;
        Resource resource = provider.load(asset.getStoragePath());
        if (resource == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on storage");
        }
        return resource;
    }
}
