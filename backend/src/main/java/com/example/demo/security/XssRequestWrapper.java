package com.example.demo.security;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class XssRequestWrapper extends HttpServletRequestWrapper {

    private final String body;

    public XssRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        
        StringBuilder stringBuilder = new StringBuilder();
        try (ServletInputStream inputStream = request.getInputStream()) {
            if (inputStream != null) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    stringBuilder.append(new String(buffer, 0, bytesRead, StandardCharsets.UTF_8));
                }
            }
        }
        
        String originalBody = stringBuilder.toString();
        // Sanitize the body
        this.body = Jsoup.clean(originalBody, Safelist.basic());
    }

    @Override
    public ServletInputStream getInputStream() {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8));
        return new ServletInputStream() {
            @Override
            public int read() {
                return byteArrayInputStream.read();
            }

            @Override
            public boolean isFinished() {
                return byteArrayInputStream.available() == 0;
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
            }
        };
    }

    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        return value == null ? null : Jsoup.clean(value, Safelist.none());
    }

    @Override
    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        if (values == null) return null;
        for (int i = 0; i < values.length; i++) {
            values[i] = Jsoup.clean(values[i], Safelist.none());
        }
        return values;
    }

    @Override
    public String getHeader(String name) {
        String value = super.getHeader(name);
        return value == null ? null : Jsoup.clean(value, Safelist.none());
    }
}
