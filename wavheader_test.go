package pcap2wav

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestInitBuf(t *testing.T) {
	wavHeader := WaveHeader{
		ChunkID:       "RIFF",
		ChunkSize:     23716,
		Format:        "WAVE",
		Subchunk1ID:   "fmt ",
		Subchunk1Size: 16,
		AudioFormat:   1,
		NumChannels:   1,
		SampleRate:    8000,
		ByteRate:      16000,
		BlockAlign:    2,
		BitsPerSample: 16,
		Subchunk2ID:   "data",
		Subchunk2Size: 23680,
	}

	wavHeader.InitBuf()
	//wavHeader.CreateHeaderBuf()

	file, err := os.OpenFile("test.txt", os.O_CREATE|os.O_RDWR, 0755)
	CheckError(err)
	defer file.Close()

	wavHeader.Write(file)

	ex := fmt.Sprintf("%X", wavHeader.Buf.Bytes())
	re := "52494646A45C000057415645666D74201000000001000100401F0000803E00000200100064617461805C0000"

	assert.Equal(t, re, ex)
	assert.Equal(t, 44, len(wavHeader.Buf.Bytes()))
}
