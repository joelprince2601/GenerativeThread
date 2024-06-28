package com.example.Generative;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class StreamController {

    @GetMapping("/stream-text")
    public SseEmitter streamText() {
        SseEmitter emitter = new SseEmitter();
        ExecutorService service = Executors.newSingleThreadExecutor();

        service.execute(() -> {
            try {
                String[] threads = {
                        "This is the first thread of text",
                        "Here is the second thread of text",
                        "Finally, this is the third thread of text"
                };

                for (String thread : threads) {
                    emitter.send(thread, MediaType.TEXT_PLAIN);
                    Thread.sleep(2000); // Simulate delay between threads
                }

                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}
