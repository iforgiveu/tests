import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "./settings";
import { sanitizeChapter } from "./sanitize";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sanitizeChapter external image downloads", () => {
  it("replaces an http(s) img src with a blob URL", async () => {
    const fetchMock = vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(new Uint8Array([1, 2, 3, 4]), {
          status: 200,
          headers: { "content-type": "image/png" },
        })
      )
    );
    const createBlobMock = vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:test-external-image");

    const html = `
      <html xmlns="http://www.w3.org/1999/xhtml">
        <body>
          <p><img src="https://rss.sfacg.com/web/novel/images/UploadPic/2018/03/9242a98c-4a4d-4f0b-81b1-b2dbf78a73a4.jpg"></p>
        </body>
      </html>
    `;

    const result = await sanitizeChapter(html, {
      basePath: "OEBPS/ch1.xhtml",
      strictXml: true,
      urlFor: () => undefined,
      settings: DEFAULT_SETTINGS,
    });

    expect(fetchMock).toHaveBeenCalledWith("https://rss.sfacg.com/web/novel/images/UploadPic/2018/03/9242a98c-4a4d-4f0b-81b1-b2dbf78a73a4.jpg");
    expect(createBlobMock).toHaveBeenCalledTimes(1);
    expect(result.html).toContain('src="blob:test-external-image"');
    expect(result.html).not.toContain("https://rss.sfacg.com/web/novel/images/UploadPic/2018/03/9242a98c-4a4d-4f0b-81b1-b2dbf78a73a4.jpg");
  });
});
