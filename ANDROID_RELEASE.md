# Chronicles of the Abyss — Android Release

## Что уже настроено

- Android-приложение использует `applicationId` `com.pokoritel.bashni`, поэтому будущие обновления могут устанавливаться поверх предыдущей версии при сохранении той же подписи.
- Игра берётся из корневого `game.html` и помещается в `assets` во время GitHub Actions.
- Внешние HTTP/HTTPS-запросы блокируются; APK работает как автономная HTML-игра.
- `localStorage`/DOM Storage включены, поэтому сохранения находятся в данных приложения и не должны удаляться обычной установкой обновления поверх старой версии.
- Release APK проверяется через `apksigner`.
- Для тегов `v*` GitHub Actions публикует APK и SHA-256 как GitHub Release.
- APK имеет имя приложения `Хроники Бездны` и Android 12+ splash screen.

## Единственный секретный шаг

Для production Release APK нужны четыре GitHub Actions Secrets:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Приватный keystore нельзя хранить в публичном репозитории.

Если keystore уже создан в Codespaces, secrets можно установить непосредственно из Codespaces через GitHub CLI, не публикуя пароль или keystore в чат.

После появления всех четырёх secrets запусти workflow **Build Release APK** вручную либо создай тег вида `v2.0.0`. Workflow соберёт и проверит подписанный APK.
