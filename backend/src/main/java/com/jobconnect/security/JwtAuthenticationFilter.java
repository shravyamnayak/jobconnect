package com.jobconnect.security;

import com.jobconnect.config.JwtTokenProvider;
import com.jobconnect.service.CustomUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = getTokenFromRequest(request);

            if (token != null && tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsernameFromToken(token);

                // Load UserDetails (so we get fresh authorities from DB if needed)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Optionally, we could also trust roles in token directly:
                List<String> rolesFromToken = tokenProvider.getRolesFromToken(token);
                List<SimpleGrantedAuthority> authorities = rolesFromToken.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                // If you prefer DB authorities, uncomment the following and use userDetails.getAuthorities()
                // var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                var auth = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ex) {
            // If anything fails, just don't set auth and continue filter chain.
            // Logging can be added here.
        }

        filterChain.doFilter(request, response);
    }
}
