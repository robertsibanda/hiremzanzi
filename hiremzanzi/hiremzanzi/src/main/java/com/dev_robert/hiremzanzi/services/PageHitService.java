package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.models.PageHit;
import com.dev_robert.hiremzanzi.repos.PageHitRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PageHitService {

    @Autowired
    PageHitRepo pageHitRepo;

    public PageHit recordHit(String path, String ipAddress, String userAgent) {
        PageHit hit = new PageHit();
        hit.setPath(path);
        hit.setIpAddress(ipAddress);
        hit.setUserAgent(userAgent);
        hit.setTimestamp(LocalDateTime.now());

        String location = resolveLocation(ipAddress);
        if (location != null) {
            String[] parts = location.split("\\|");
            if (parts.length >= 1) hit.setCity(parts[0]);
            if (parts.length >= 2) hit.setRegion(parts[1]);
            if (parts.length >= 3) hit.setCountry(parts[2]);
        }

        return pageHitRepo.save(hit);
    }

    public List<PageHit> getAllHits() {
        return pageHitRepo.findAll();
    }

    private String resolveLocation(String ip) {
        if (ip == null || ip.isEmpty() || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            return "Localhost|Local|ZZ";
        }
        try {
            java.net.URL url = new java.net.URL("http://ip-api.com/json/" + ip + "?fields=status,country,regionName,city");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            java.io.InputStream is = conn.getInputStream();
            String json = new String(is.readAllBytes());
            is.close();

            String city = extractJsonField(json, "city");
            String region = extractJsonField(json, "regionName");
            String country = extractJsonField(json, "country");

            if (city.isEmpty() && region.isEmpty() && country.isEmpty()) {
                return null;
            }
            return city + "|" + region + "|" + country;
        } catch (Exception e) {
            return null;
        }
    }

    private String extractJsonField(String json, String field) {
        String key = "\"" + field + "\":";
        int start = json.indexOf(key);
        if (start == -1) return "";
        start += key.length();
        if (json.charAt(start) == '"') {
            start++;
            int end = json.indexOf("\"", start);
            if (end == -1) return "";
            return json.substring(start, end);
        }
        int end = json.indexOf(",", start);
        if (end == -1) end = json.indexOf("}", start);
        if (end == -1) return "";
        return json.substring(start, end).trim();
    }
}
