package com.project.project_rest_api.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            System.out.println("Brak tokenu lub nieprawidłowy format nagłówka Authorization");
            String token = authorizationHeader.substring(7);
            try {
                String username = jwtUtil.validateToken(token);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null,
                                Collections.singletonList(new SimpleGrantedAuthority("USER")));
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (RuntimeException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nieprawidłowy token");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
