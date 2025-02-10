;; Data Storage Contract

;; Define data structures
(define-map device-data
  { device-id: (string-utf8 36) }
  {
    data: (string-utf8 256),
    timestamp: uint
  }
)

;; Error codes
(define-constant err-invalid-data (err u101))

;; Functions
(define-public (store-data (device-id (string-utf8 36)) (data (string-utf8 256)))
  (begin
    (asserts! (> (len data) u0) err-invalid-data)
    (ok (map-set device-data
      { device-id: device-id }
      {
        data: data,
        timestamp: block-height
      }
    ))
  )
)

(define-read-only (get-latest-data (device-id (string-utf8 36)))
  (map-get? device-data { device-id: device-id })
)

