package org.example.utcctp.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageProvider {
    String name();

    StoredObject store(MultipartFile file, String storedName);

    /**
     * Return a local Resource for the file. May return null when the provider does not support
     * streaming through the backend (in that case the caller should redirect to publicUrl).
     */
    Resource load(String storagePath);
}
