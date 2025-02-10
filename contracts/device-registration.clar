;; Device Registration Contract

;; Define data structures
(define-map devices
  { device-id: (string-utf8 36) }
  {
    owner: principal,
    name: (string-utf8 64),
    device-type: (string-utf8 32),
    registration-date: uint
  }
)

;; Error codes
(define-constant err-device-already-registered (err u100))
(define-constant err-device-not-found (err u101))
(define-constant err-not-device-owner (err u102))

;; Functions
(define-public (register-device (device-id (string-utf8 36)) (name (string-utf8 64)) (device-type (string-utf8 32)))
  (let
    ((existing-device (map-get? devices { device-id: device-id })))
    (asserts! (is-none existing-device) err-device-already-registered)
    (ok (map-set devices
      { device-id: device-id }
      {
        owner: tx-sender,
        name: name,
        device-type: device-type,
        registration-date: block-height
      }
    ))
  )
)

(define-public (update-device-name (device-id (string-utf8 36)) (new-name (string-utf8 64)))
  (let
    ((device (unwrap! (map-get? devices { device-id: device-id }) err-device-not-found)))
    (asserts! (is-eq (get owner device) tx-sender) err-not-device-owner)
    (ok (map-set devices
      { device-id: device-id }
      (merge device { name: new-name })
    ))
  )
)

(define-public (deregister-device (device-id (string-utf8 36)))
  (let
    ((device (unwrap! (map-get? devices { device-id: device-id }) err-device-not-found)))
    (asserts! (is-eq (get owner device) tx-sender) err-not-device-owner)
    (ok (map-delete devices { device-id: device-id }))
  )
)

(define-read-only (get-device-info (device-id (string-utf8 36)))
  (map-get? devices { device-id: device-id })
)

(define-read-only (is-device-owner (device-id (string-utf8 36)) (owner principal))
  (match (map-get? devices { device-id: device-id })
    device (is-eq (get owner device) owner)
    false
  )
)

