package com.jobconnect.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long validityMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret:change-me-in-prod}") String secret,
            @Value("${app.jwt.expiration-ms:3600000}") long validityMs // 1 hour default
    ) {
        // Use a HS256 key derived from the secret (if secret is base64 the key will still work).
        this.key = Keys.hmacShaKeyFor(Arrays.copyOf(secret.getBytes(), 32)); // ensure 256-bit key
        this.validityMs = validityMs;
    }

    public String generateToken(String username, Collection<String> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityMs);

        Claims claims = Jwts.claims().setSubject(username);
        // add roles as a claim
        claims.put("roles", roles);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> parsed = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            // parsed.getBody().getExpiration() can be used if needed
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List) {
            return ((List<?>) rolesObj).stream().map(Object::toString).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }
}
