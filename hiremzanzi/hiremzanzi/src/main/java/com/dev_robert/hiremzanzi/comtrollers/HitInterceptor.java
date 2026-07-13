package com.dev_robert.hiremzanzi.comtrollers;

import com.dev_robert.hiremzanzi.services.PageHitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class HitInterceptor implements HandlerInterceptor {

    @Autowired
    PageHitService pageHitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (method.equals("GET") && !path.startsWith("/api/") && !path.startsWith("/assets/") && !path.contains("favicon")) {
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty()) {
                ip = request.getRemoteAddr();
            } else {
                ip = ip.split(",")[0].trim();
            }
            String userAgent = request.getHeader("User-Agent");

            pageHitService.recordHit(path, ip, userAgent);
        }

        return true;
    }
}
