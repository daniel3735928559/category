<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />
  
  <xsl:template match="statement">
    <xsl:choose>
      <xsl:when test="@type='lemma'">
	<p><b>Lemma (<xsl:value-of select="@name" />):</b></p>
	<xsl:apply-templates select="text()|*" />
      </xsl:when>
      <xsl:when test="@type='theorem'">
	<p><b>Theorem (<xsl:value-of select="@name" />):</b></p>
	<xsl:apply-templates select="text()|*" />
      </xsl:when>
      <xsl:when test="@type='proposition'">
	<p><b>Proposition (<xsl:value-of select="@name" />):</b></p>
	<xsl:apply-templates select="text()|*" />
      </xsl:when>
      <xsl:when test="@type='conjecture'">
	<p><b>Conjecture (<xsl:value-of select="@name" />):</b></p>
	<xsl:apply-templates select="text()|*" />
      </xsl:when>
      <xsl:otherwise>
	<xsl:apply-templates select="text()|*" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="definition">
    <xsl:apply-templates select="text()|*" />
  </xsl:template>
  
  <xsl:template match="proof">
    <p><b>Proof: </b></p>
    <xsl:apply-templates select="text()|*" />
  </xsl:template>
  
</xsl:stylesheet>
