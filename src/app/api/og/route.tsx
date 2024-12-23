import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <svg
          width="151"
          height="160"
          viewBox="0 0 151 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M151 75.5C151 55.4762 143.046 36.2724 128.887 22.1134C114.728 7.95444 95.5238 1.51176e-06 75.5 0C55.4762 -1.51176e-06 36.2724 7.95444 22.1134 22.1134C7.95445 36.2724 3.02352e-06 55.4761 0 75.5L8.003 75.5C8.003 57.5987 15.1143 40.4305 27.7724 27.7724C40.4306 15.1143 57.5987 8.003 75.5 8.003C93.4013 8.003 110.569 15.1143 123.228 27.7724C135.886 40.4306 142.997 57.5987 142.997 75.5H151Z"
            fill="#A3A3A3"
          />
          <path
            d="M0 75.5H8C7.89024 92.0997 9.64158 101.405 14 118C5.59714 102.608 2.09041 93.4834 0 75.5Z"
            fill="#A3A3A3"
          />
          <path
            d="M151 75H143C143.11 91.5997 141.358 100.905 137 117.5C145.403 102.108 148.91 92.9834 151 75Z"
            fill="#A3A3A3"
          />
          <path
            d="M42 146.5V41.5L90 88V35H101.5V115.5L53 68.5V138C59.5615 142.513 63.5852 144.422 71.5 146.5C80.6764 144.4 85.707 141.7 94.5 134.5C103.821 127.152 108.739 121.865 117 110.5C125.512 95.6332 129.018 86.2599 134 68.5C134.577 80.0732 133.931 86.538 130 98C123.338 117.209 118.331 126.558 106.5 140C94.5535 149.34 73.5 159.5 73.5 159.5C73.5 159.5 71.0768 160.221 68.5 159.5L42 146.5Z"
            fill="#A3A3A3"
          />
        </svg>
        <div
          style={{
            marginTop: 12,
            fontSize: 52,
            color: "#A3A3A3",
          }}
        >
          Nehno
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
