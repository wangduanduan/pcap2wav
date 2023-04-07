package pcap2wav

import (
	"bytes"
	"encoding/binary"
	"io"
)

// http://soundfile.sapp.org/doc/WaveFormat/

type WaveHeader struct {
	ChunkID       string // RIFF  big
	ChunkSize     uint32 //       little
	Format        string // WAVE  big
	Subchunk1ID   string // fmt big
	Subchunk1Size uint32 // little
	AudioFormat   uint16 // little
	NumChannels   uint16 // little
	SampleRate    uint32 // little
	ByteRate      uint32 // little
	BlockAlign    uint16 // little
	BitsPerSample uint16 // little
	Subchunk2ID   string // big data
	Subchunk2Size uint32 // little
	Buf           *bytes.Buffer
}

const (
	WAVEHeaderLen = 44
)

func (w *WaveHeader) DemoIt(s int) {
	w.ChunkID = "RIFF"
	w.ChunkSize = uint32(s + 36)
	w.Format = "WAVE"
	w.Subchunk1ID = "fmt "
	w.Subchunk1Size = 16
	w.AudioFormat = 1
	w.NumChannels = 1
	w.SampleRate = 8000
	w.ByteRate = 16000
	w.BlockAlign = 2
	w.BitsPerSample = 16
	w.Subchunk2ID = "data"
	w.Subchunk2Size = uint32(s)
}

func (w *WaveHeader) InitBuf() {
	//w.Buf = bytes.NewBuffer(make([]byte, WAVEHeaderLen))
	w.Buf = new(bytes.Buffer)
	w.createHeaderBuf()
}

func (w *WaveHeader) Write(file io.Writer) {
	_, err := file.Write(w.Buf.Bytes())
	CheckError(err)
}

func (w *WaveHeader) writeField(order binary.ByteOrder, data any) {
	err := binary.Write(w.Buf, binary.LittleEndian, data)
	CheckError(err)
}

func (w *WaveHeader) createHeaderBuf() {
	w.writeField(binary.BigEndian, []byte(w.ChunkID))
	w.writeField(binary.LittleEndian, w.ChunkSize)
	w.writeField(binary.BigEndian, []byte(w.Format))
	w.writeField(binary.BigEndian, []byte(w.Subchunk1ID))
	w.writeField(binary.LittleEndian, w.Subchunk1Size)
	w.writeField(binary.LittleEndian, w.AudioFormat)
	w.writeField(binary.LittleEndian, w.NumChannels)
	w.writeField(binary.LittleEndian, w.SampleRate)
	w.writeField(binary.LittleEndian, w.ByteRate)
	w.writeField(binary.LittleEndian, w.BlockAlign)
	w.writeField(binary.LittleEndian, w.BitsPerSample)
	w.writeField(binary.BigEndian, []byte(w.Subchunk2ID))
	w.writeField(binary.LittleEndian, w.Subchunk2Size)
}
