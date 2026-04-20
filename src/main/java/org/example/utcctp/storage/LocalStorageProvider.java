package org.example.utcctp.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class LocalStorageProvider implements StorageProvider {
    private final Path rootPath;

    public LocalStorageProvider(@Value("${app.storage.root:uploads}") String rootDir) {
        this.rootPath = Paths.get(rootDir);
        try {
            Files.createDirectories(rootPath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to initialize local storage", ex);
        }
    }

    @Override
    public String name() {
        return "LOCAL";
    }

    @Override
    public StoredObject store(MultipartFile file, String storedName) {
        Path destination = rootPath.resolve(storedName);
        try {
            Files.copy(file.getInputStream(), destination);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
        }
        return new StoredObject("LOCAL", destination.toString(), null, null);
    }

    @Override
    public Resource load(String storagePath) {
        if (storagePath == null) {
            return null;
        }
        Path path = Paths.get(storagePath);
        if (!Files.exists(path)) {
            return null;
        }
        return new FileSystemResource(path);
    }
}
