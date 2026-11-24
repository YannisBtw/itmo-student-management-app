package ru.itmo.weblab3.resource;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import ru.itmo.weblab3.dto.auth.LoginRequestDto;
import ru.itmo.weblab3.dto.auth.RegisterRequestDto;
import ru.itmo.weblab3.dto.auth.TokenResponseDto;
import ru.itmo.weblab3.dto.auth.UserResponseDto;
import ru.itmo.weblab3.exception.AuthenticationException;
import ru.itmo.weblab3.security.Public;
import ru.itmo.weblab3.service.AuthService;
import ru.itmo.weblab3.service.UserService;


@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private static final String ACCESS_COOKIE = "access_token";
    private static final String REFRESH_COOKIE = "refresh_token";
    private static final String COOKIE_PATH = "/";


    @Inject
    UserService userService;

    @Inject
    AuthService authService;


    @POST
    @Path("/register")
    @Public
    public Response register(@Valid RegisterRequestDto req) {
        UserResponseDto dto = userService.register(req);

        return Response
                .status(Response.Status.CREATED)
                .entity(dto)
                .build();
    }


    @POST
    @Path("/login")
    @Public
    public Response login(@Valid LoginRequestDto req) {
        TokenResponseDto tokens = authService.login(req);

        return Response
                .noContent()
                .cookie(
                        createCookie(
                                ACCESS_COOKIE,
                                tokens.getAccessToken(),
                                tokens.getExpiresIn()
                        ),
                        createCookie(
                                REFRESH_COOKIE,
                                tokens.getRefreshToken(),
                                authService.getRefreshTtlSeconds()
                        )
                )
                .build();
    }


    @POST
    @Path("/refresh")
    @Public
    public Response refresh(
            @CookieParam(REFRESH_COOKIE) String refreshToken
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthenticationException(
                    "Refresh token not found"
            );
        }

        TokenResponseDto tokens =
                authService.refresh(refreshToken);

        return Response
                .noContent()
                .cookie(
                        createCookie(
                                ACCESS_COOKIE,
                                tokens.getAccessToken(),
                                tokens.getExpiresIn()
                        ),
                        createCookie(
                                REFRESH_COOKIE,
                                tokens.getRefreshToken(),
                                authService.getRefreshTtlSeconds()
                        )
                )
                .build();
    }


    @POST
    @Path("/logout")
    @Public
    public Response logout(
            @CookieParam(REFRESH_COOKIE) String refreshToken
    ) {
        authService.logout(refreshToken);

        return Response
                .noContent()
                .cookie(
                        clearCookie(ACCESS_COOKIE),
                        clearCookie(REFRESH_COOKIE)
                )
                .build();
    }


    @GET
    @Path("/me")
    public Response me(
            @Context SecurityContext securityContext
    ) {
        String username =
                securityContext.getUserPrincipal().getName();

        return Response
                .ok(userService.getByUsername(username))
                .build();
    }


    private NewCookie createCookie(
            String name,
            String value,
            long maxAgeSeconds
    ) {
        return new NewCookie.Builder(name)
                .value(value)
                .path(COOKIE_PATH)
                .maxAge(Math.toIntExact(maxAgeSeconds))
                .httpOnly(true)
                .secure(false)
                .sameSite(NewCookie.SameSite.STRICT)
                .build();
    }


    private NewCookie clearCookie(String name) {
        return new NewCookie.Builder(name)
                .value("")
                .path(COOKIE_PATH)
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .sameSite(NewCookie.SameSite.STRICT)
                .build();
    }
}