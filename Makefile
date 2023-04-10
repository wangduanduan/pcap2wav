ssrc1=0x3522cd97
ssrc2=0x880e11ff

test:
	go test -v ./...
run:clean build
	./pcap2wav -in one.pcap
build:
	go build -o pcap2wav cmd/main.go 
clean:
	-rm *.wav *.pcm
merge:
	sox -M -c 1 $(ssrc1).wav -c 1 $(ssrc2).wav out.wav